export default interface ViewProtocol {
  state: {[x: string]: any};
  props: object;
  updateState: (state: object) => void;
}
