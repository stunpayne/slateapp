import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // stateReconciler: autoMergeLevel2,
    whitelist: ['auth', 'task']
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    pReducer,
    compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
)


export const persistor = persistStore(store);