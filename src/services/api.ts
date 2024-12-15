import axios from 'axios';
import { RowData } from '../types/RowData';

// fetchData is a function to fetch data from the API
export const fetchData = async (page: number, limit: number, setData?: (data: RowData[]) => void, setTotalRecords?: (total: number) => void) => {
  try {
    const result = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`);
    const items = result.data.data || [];
    const mappedData = items.map((item: RowData) => ({
      id: item.id,
      title: item.title,
      place_of_origin: item.place_of_origin,
      artist_display: item.artist_display,
      inscriptions: item.inscriptions,
      date_start: item.date_start,
      date_end: item.date_end,
    }));
    if (setData) setData(mappedData);
    if (setTotalRecords) setTotalRecords(result.data.pagination.total || 0);
    return { data: mappedData, total: result.data.pagination.total || 0 };
  } catch (error) {
    console.error('Error fetching data:', error);
    if (setData) setData([]);
    if (setTotalRecords) setTotalRecords(0);
    return { data: [], total: 0 };
  }
};