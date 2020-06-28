import axios from 'axios';

export const buildClient = ({req}) => {
    if(typeof window === 'undefined'){
        return axios.create({
            baseURL: process.env.INGRESS_END_POINT,
            headers: req.headers
        });
    }

    return axios.create();
}