import Webservice from './webservice';

function getMindPops(url: string, params: Array<any>) {
  const [request, headers] = params;
  return Webservice.postRequest(`${url}/api/mindpop/list`, headers, request);
}

function getMindPopWithId(url: string, params: Array<any>, CB: any) {
  const [request, headers] = params;
  return Webservice.newPostRequest(`${url}/api/mindpop/list`, headers, request, false, CB);
}

function addMindPops(url: string, request: any, headers: any, CB: any) {
  return Webservice.newPostRequest(`${url}/api/mindpop/update`, headers, request, false, CB);
}

function deleteMindPops(url: string, params: Array<any>) {
  const [request, headers] = params;
  return Webservice.postRequest(
    `${url}/api/mindpop/delete`,
    headers,
    request.payload,
  );
}

export { getMindPops, addMindPops, deleteMindPops, getMindPopWithId };
