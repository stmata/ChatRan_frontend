import { createContext, useContext } from "react";
import PropTypes from "prop-types";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
   

    return (
        <SessionContext.Provider
            value={{
            
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

SessionProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useSession = () => useContext(SessionContext);
