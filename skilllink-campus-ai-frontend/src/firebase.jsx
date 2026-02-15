import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvzrkxyq9Z4L_MHW_cUk-zowMSTWLwoaQ",
  authDomain: "skillink-616db.firebaseapp.com",
  projectId: "skillink-616db",
  appId: "1:566458649185:web:e996594bb4f2c92b10b820",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
