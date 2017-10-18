/**
 * Created by Guangwen on 2017/7/30.
 */
import axios from 'axios';
import { message } from 'antd';

export const get = ({url, msg = 'Interface Exceptions', headers}) =>
    axios.get(url, headers).then(res => res.data).catch(err => {
       console.log(err);
       message.warn(msg);
    });

export const post = ({url, data, msg = 'Interface Exceptions', headers}) =>
    axios.post(url, data, headers).then(res => res.data).catch(err => {
        console.log(err);
        message.warn(msg);
    });
