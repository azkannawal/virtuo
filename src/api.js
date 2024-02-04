import axios from "axios";

const url = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export const postRating = async (id, rating, a) => {
  const options = {
    method: "POST",
    params: { guest_session_id: `${a}` },
    url: `${url}/movie/${id}/rating?api_key=${apiKey}`,
    data: { value: `${rating}` },
  };
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};
export const getGuest = () => {
  const set = {
    method: "GET",
    url: `${url}/authentication/guest_session/new?api_key=${apiKey}`,
  };
  return new Promise((resolve, reject) => {
    axios
      .request(set)
      .then(function (response) {
        const token = response.data;
        console.log(token);
        resolve(token);
      })
      .catch(function (error) {
        console.error(error);
        reject(error);
      });
  });
};
export const searchMovie = async (q) => {
  const search = await axios.get(
    `${url}/search/movie?query=${q}&api_key=${apiKey}`
  );
  return search.data;
};
export const getTrailer = (id, callback) => {
  axios
    .get(`${url}/movie/${id}/videos?api_key=${apiKey}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};
export const getDetailMovie = (id, callback) => {
  axios
    .get(`${url}/movie/${id}?api_key=${apiKey}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};
export const getNewRelease = async (callback) => {
  await axios
    .get(`${url}/movie/now_playing?api_key=${apiKey}`)
    .then((response) => {
      callback(response.data.results);
    })
    .catch((error) => {
      console.error(error);
    });
};
export const getPopular = async (callback) => {
  const options = {
    method: "GET",
    url: `${url}/movie/popular?api_key=${apiKey}`,
    params: { language: "en-US", page: "2" },
  };
  await axios
    .request(options)
    .then((response) => {
      callback(response.data.results);
    })
    .catch((error) => {
      console.error(error);
    });
};
export const getTopRated = async (callback) => {
  await axios
    .get(`${url}/movie/top_rated?api_key=${apiKey}`)
    .then((response) => {
      callback(response.data.results);
    })
    .catch((error) => {
      console.error(error);
    });
};
