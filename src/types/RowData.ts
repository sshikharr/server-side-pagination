// RowData is an interface representing the structure of a row in the data table
export interface RowData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}