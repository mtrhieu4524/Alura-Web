import { useEffect } from "react";


const Home = () => {
    useEffect(() => {
        document.title = "Alurà - Home";
    }, []);

    return (
        <div>
            <h1>This is home</h1>
            <h1>This is home</h1>  <h1>This is home</h1>  <h1>This is home</h1>  <h1>This is home</h1>  <h1>This is home</h1>  <h1>This is home</h1>  <h1>This is home</h1>
        </div>
    );
};

export default Home;
