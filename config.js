module.exports = {
    'secret': 'SeCrEtKeYfOrHaShInG',
    'mongodbUri': 'mongodb://localhost/place',
    'port':7777,
    'user_google_place_api':{
        "textsearch": "textsearch",
        "autocomplete": "autocomplete",
        "place_details": "details"
    },
    'naver':{
        'client_id': 'xRyUTFFEDEnI8KYl2OWB',
        'client_secret': 'oTPyfngrud'
    },
    'naver_map':{
        'get_geocode' : '/v1/map/geocode',
        'get_reverse_geocode' : '/v1/map/reversegeocode'
    },
    'naver_search':{
        'local' : '/v1/search/local.json'
    },
    'google_api_key': 'AIzaSyCwxK5X9VTXnA2MYTGXNtZWhzhAsHGKTdw',
    'google_map_endpoint' : 'maps.googleapis.com',
    'naver_map_endpoint' : 'openapi.naver.com'
}