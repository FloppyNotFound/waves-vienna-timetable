/* eslint-disable */
export interface TimeSlot {
  title: string;
  id: number;
  thumbnail: string;
  thumbnail_size: boolean;
  multiday: boolean;
  ending: string;
  duration: string;
  terms: Terms;
  period: number;
  excerpt: string;
  hash: string;
  visible: boolean;
  timestamp: number;
  last: boolean;
  start: string;
  end: string;
  future: boolean;
  finished: boolean;
  permalink: string;
  buttons: Buttons;
  meta: any[];
}

export interface Buttons {
  main: ButtonMain;
}

export interface ButtonMain {
  custom_url: boolean;
  permalink: string;
  label: string;
  email: boolean;
  method: number;
  target: boolean;
  ical: string;
}

export interface Terms {
  wcs_type: Wcstype[];
  wcs_room: Wcstype[];
}

export interface Wcstype {
  slug: string;
  id: number;
  url?: any;
  desc: boolean;
  name: string;
}
