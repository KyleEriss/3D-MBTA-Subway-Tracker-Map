type MbtaData = [{
  attributes: {
    bearing: number;
    current_status: string;
    current_stop_sequence: number;
    direction_id: number;
    label: string;
    latitude: number;
    longitude: number;
    occupance_status: null;
    speed: number;
    updated_at: string;
  };
  id: string;
  links: {
    self: string;
  };
  relationships: {
    route: {
      data: {
        id: string;
        type: string;
      };
    };
    stop: {
      data: {
        id: string;
        type: string;
      };
    };
    trip: {
      data: {
        id: string;
        type: string;
      };
    };
  };
  type: string;
}] | void;

export default MbtaData;
