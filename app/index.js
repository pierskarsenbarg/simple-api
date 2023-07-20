exports.handler = async (e) => {
    console.log(e);
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hello, World!"})
    };
}