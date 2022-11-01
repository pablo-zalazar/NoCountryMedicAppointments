import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;

export const actionUserLogin = (user) => {
  return async function (dispatch) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const URL = `/api/loginUser`;
    try {
      const { data } = await axios.post(URL, user, config);
      return data.token;
    } catch (e) {
      // console.log(e);
      throw e.response.data.msg;
    }
  };
};

export const actionUserLogout = () => {
  return async function (dispatch) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const URL = `/api/users/logout`;
    try {
      await axios.post(URL, config);
      dispatch(logout());
      return;
    } catch (e) {
      throw e.response.data.msg;
    }
  };
};

export const patientRegister = (user) => {
  return async function () {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const URL = `/api/registerPatient`;
    try {
      await axios.post(URL, user, config);
      return;
    } catch (e) {
      throw e.response.data.msg;
    }
  };
};

export const professionalRegister = (user) => {
  return async function () {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const URL = `/api/users/registerProfessional`;
    try {
      const res = await axios.post(URL, user, config);
      return;
    } catch (e) {
      throw e.response.data.msg;
    }
  };
};

export const actionAuthenticateUser = (token) => {
  return async function (dispatch) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const URL = `/api/users/profile`;
    try {
      const { data } = await axios.post(URL, { token }, config);
      dispatch(login(data));
      return;
    } catch (e) {
      return e.message;
    }
  };
};

export const updateProfile = (user) => {
  return async function (dispatch) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const URL = `/api/users/update`;
    try {
      const { data } = await axios.put(URL, user, config);
      dispatch(login(data));
    } catch (e) {
      throw e.message;
    }
  };
};

export const changeActive = (user) => {
  return async function () {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const URL = `/api/professionals/changeActive`;
    try {
      await axios.put(URL, user, config);
      return;
    } catch (e) {
      throw e.message;
    }
  };
};

export const forgetPassword = (values) => {
  return async function () {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const URL = `/api/users/forgetPassword`;
    try {
      await axios.post(URL, values, config);
      return;
    } catch (e) {
      throw e.response.data;
    }
  };
};

export const changePassword = (values) => {
  return async function () {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const URL = `/api/users/changePassword`;
    try {
      const user = await axios.put(URL, values, config);
      return;
    } catch (e) {
      throw e.response.data;
    }
  };
};
