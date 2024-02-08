import axios from "axios";
const url = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export const postRating = async (id, rating, session) => {
  const options = {
    method: "POST",
    params: { guest_session_id: `${session}` },
    url: `${url}/movie/${id}/rating?api_key=${apiKey}`,
    data: { value: `${rating}` },
  };
  await axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const deleteRating = async (id, session) => {
  const options = {
    method: "DELETE",
    params: { guest_session_id: `${session}` },
    url: `${url}/movie/${id}/rating?api_key=${apiKey}`,
  };
  await axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

export const getRating = async (session, callback) => {
  const options = {
    method: "GET",
    url: `${url}/guest_session/${session}/rated/movies?api_key=${apiKey}`,
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

export const getGuest = async (callback) => {
  const options = {
    method: "GET",
    url: `${url}/authentication/guest_session/new?api_key=${apiKey}`,
  };
  await axios
    .request(options)
    .then((response) => {
      callback(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const searchMovie = async (q) => {
  const search = await axios.get(
    `${url}/search/movie?query=${q}&api_key=${apiKey}`
  );
  return search.data;
};

export const getTrailer = async (id, callback) => {
  await axios
    .get(`${url}/movie/${id}/videos?api_key=${apiKey}`)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const getDetailMovie = async (id, callback) => {
  await axios
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

export const getPopular = async (callback) => {
  const options = {
    method: "GET",
    url: `${url}/movie/popular?api_key=${apiKey}`,
    params: { page: "2" },
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
