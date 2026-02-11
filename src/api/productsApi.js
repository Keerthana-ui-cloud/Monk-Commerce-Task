import axios from "axios";

const API_URL =
  "https://stageapi.monkcommerce.app/task/products/search";

const API_KEY = "PASTE_YOUR_API_KEY_HERE";

export const fetchProducts = async ({ search = "", page = 0 }) => {
  const response = await axios.get(API_URL, {
    params: {
      search,
      page,
      limit: 10
    },
    headers: {
      "x-api-key": API_KEY
    }
  });

  return response.data;
};
