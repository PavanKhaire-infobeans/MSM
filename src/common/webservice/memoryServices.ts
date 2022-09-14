import Webservice from './webservice';

function MemoryService(url: string, params: Array<any>) {
  const [headers, request] = params;
  return Webservice.postRequest(url, headers, request);
}

function newMemoryService(url: string, params: Array<any>,CB) {
  const [headers, request] = params;
  // return Webservice.postRequest(url, headers, request);
  return Webservice.newPostRequest(url, headers, request, false, (data) => {
    CB(data)
  });
}

export { MemoryService, newMemoryService };
