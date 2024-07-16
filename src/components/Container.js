import { Children } from "react";


const Container = ({children}) => {
    return (
        <div className="container">
            {children}
        </div>
    )
};

export default Container;