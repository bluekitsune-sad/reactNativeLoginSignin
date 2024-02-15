import axios from "axios";
import { ApiContants } from "../constants";
import useUserManagement from "../utils/userData";

const AuthRequest = axios.create({
  baseURL: ApiContants.BACKEND_API.BASE_API_URL,
  // baseURL: "http://localhost:3001/api",
  // baseURL: "https://62bf-101-53-224-18.ngrok-free.app/api",
});
// const [user, setUser] = useState({
//   username: "",
//   email: "",
//   password: "",
// });

const register = async (user) => {
  if (!user?.username || !user?.email || !user?.password) {
    return { status: false, message: "Please fill up all fields" };
  }
  try {
    let requestBody = {
      username: user?.username,
      email: user?.email,
      password: user?.password,
    };
    let registerResponse = await AuthRequest.post(
      ApiContants.BACKEND_API.REGISTER,
      requestBody
    );
    return registerResponse?.data;
  } catch (error) {
    console.log(error);
    return { status: false, message: "Oops! Something went wrong" };
  }
};

const login = async (user) => {
  if (!user?.username || !user?.password) {
    return { status: false, message: "Please fill up all fields" };
  }
  try {
    let requestBody = JSON.stringify({
      username: user?.username,
      password: user?.password,
    });
    // let requestBody = {
    //   username: user?.username,
    //   password: user?.password,
    // };
    // console.log("initial request created: " + requestBody);

    //   "http://192.168.0.103:3001/api/getUser/" + requestBody
    let loginResponse = await AuthRequest.get(
      ApiContants.BACKEND_API.LOGIN + requestBody,
      requestBody
    );

    // console.log("this is the result data: ", loginResponse?.data);
    // const { updateUser } = useUserManagement();
    // updateUser(loginResponse?.data);
    return loginResponse?.data;
  } catch (error) {
    console.log(error);
    return { status: false, message: "Oops! Something went wrong" };
  }
};

const checkUserExist = async (type, value) => {
  try {
    let params = { [type]: value };
    let userCheckResponse = await AuthRequest.get(
      ApiContants.BACKEND_API.USER_EXIST,
      { params }
    );
    return userCheckResponse?.data;
  } catch (error) {
    console.log(error);
    return { status: false, message: "Oops! Something went wrong" };
  }
};

const refreshToken = async () => {
  try {
    let tokenResponse = await AuthRequest.post(
      ApiContants.BACKEND_API.REFRESH_TOKEN
      // { headers: authHeader(getToken()) }
    );
    if (tokenResponse?.status === 200) {
      return { status: true, data: tokenResponse?.data };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.log(error);
    return { status: false, message: "Oops! Something went wrong" };
  }
};

const test = async () => {
  try {
    // let apirespons = await AuthRequest.get(
    // ApiContants.BACKEND_API.TEST
    // { headers: authHeader(getToken()) }
    // );
    let apirespons = await axios.get(
      "http://192.168.0.103:3001/test"
      // "https://62bf-101-53-224-18.ngrok-free.app/test"
    );

    if (apirespons?.status === 200) {
      console.log(apirespons);
      return { status: true, data: apirespons?.data };
    } else {
      return { status: false };
    }
  } catch (error) {
    console.log(error);
    return { status: false, message: "Oops! Something went wrong" };
  }
};

export default { register, login, checkUserExist, refreshToken, test };
