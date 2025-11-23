import axios from "axios";
import {BASE_URL} from "../constants";
import { TrackType } from "@/app/sharedTypes/sharedTypes";

export const getTracks = (): Promise<TrackType[]> => {
    return axios(BASE_URL + "/catalog/track/all/").then((res) => {
        console.log(res.data.data);
        return res.data.data;
    })
}