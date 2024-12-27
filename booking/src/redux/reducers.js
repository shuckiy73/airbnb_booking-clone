import { combineReducers } from 'redux';
import userReducer from './userReducer'; // Импортируйте ваш редюсер

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;