import 'package:campus_mobile_experimental/core/data_providers/user_data_provider.dart';
import 'package:campus_mobile_experimental/core/models/shuttle_arrival_model.dart';
import 'package:campus_mobile_experimental/core/models/shuttle_stop_model.dart';
import 'package:campus_mobile_experimental/core/services/networking.dart';

class ShuttleService {
  ShuttleService();
  bool _isLoading = false;
  DateTime _lastUpdated;
  String _error;
  ShuttleStopModel _shuttleStopModel = ShuttleStopModel();
  List<ShuttleStopModel> _data = List<ShuttleStopModel>();
  UserDataProvider _userDataProvider;

  /// add state related things for view model here
  /// add any type of data manipulation here so it can be accessed via provider

  List<ShuttleStopModel> get data => _data;

  final NetworkHelper _networkHelper = NetworkHelper();
  final String endpoint = "https://api-qa.ucsd.edu:8243/shuttles/v1.0.0/stops";
  String arrivingEndpoint;
  final Map<String, String> headers = {
    "accept": "application/json",
    "Authorization":
        "Basic djJlNEpYa0NJUHZ5akFWT0VRXzRqZmZUdDkwYTp2emNBZGFzZWpmaWZiUDc2VUJjNDNNVDExclVh"
  };

  Future<bool> fetchData() async {
    _error = null;
    _isLoading = true;

    try {
      /// fetch data
      String _response = await _networkHelper.fetchData(
          "https://s3-us-west-2.amazonaws.com/ucsd-its-wts/now_ucsandiego/v1/shuttle_stops_master_map_no_routes.json");

      /// parse data
      var data = shuttleStopModelFromJson(_response);
      _data = data;
      _isLoading = false;
      return true;
    } catch (e) {
      /// if the authorized fetch failed we know we have to refresh the
      /// token for this service
      if (e.toString().contains("401")) {
        if (await getNewToken()) {
          return await fetchData();
        }
      }
      _error = e.toString();
      _isLoading = false;
      return false;
    }
  }

  Future<List<ArrivingShuttle>> getArrivingInformation(stopId) async {
    _error = null;
    _isLoading = true;
    try {
      /// fetch data
      arrivingEndpoint =
          "https://api-qa.ucsd.edu:8243/shuttles/v1.0.0/stops/$stopId/arrivals";
      String _response =
          await _networkHelper.authorizedFetch(arrivingEndpoint, headers);

      /// parse data
      final arrivingData = getArrivingShuttles(_response);
      _isLoading = false;
      return arrivingData;
    } catch (e) {
      /// if the authorized fetch failed we know we have to refresh the
      /// token for this service

      if (e.toString().contains("401")) {
        if (await getNewToken()) {
          return await getArrivingInformation(stopId);
        }
      }

      _error = e.toString();
      _isLoading = false;
    }
  }

  Future<bool> getNewToken() async {
    final String tokenEndpoint = "https://api-qa.ucsd.edu:8243/token";
    final Map<String, String> tokenHeaders = {
      "content-type": 'application/x-www-form-urlencoded',
      "Authorization":
          "Basic djJlNEpYa0NJUHZ5akFWT0VRXzRqZmZUdDkwYTp2emNBZGFzZWpmaWZiUDc2VUJjNDNNVDExclVh"
    };
    print("Getting new token");
    try {
      var response = await _networkHelper.authorizedPost(
          tokenEndpoint, tokenHeaders, "grant_type=client_credentials");
      headers["Authorization"] = "Bearer " + response["access_token"];
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    }
  }

  bool get isLoading => _isLoading;

  String get error => _error;

  DateTime get lastUpdated => _lastUpdated;
}
