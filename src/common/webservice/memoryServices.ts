import Webservice from './webservice';

function MemoryService(url: string, params: Array<any>) {
  const [headers, request] = params;
  return Webservice.postRequest(url, headers, request);
}

export {MemoryService};
