import Webservice from './webservice';
import Utility from '../utility';
import {ToastMessage} from '../component/Toast';
import {NO_INTERNET} from '../constants';
import loaderHandler from '../component/busyindicator/LoaderHandler';

function MemoryService(url: string, params: Array<any>) {
  const [headers, request] = params;
  return Webservice.postRequest(url, headers, request);
}

export {MemoryService};
