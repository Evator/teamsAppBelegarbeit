
// query async
module.exports = async (conn, q, params) => new Promise(
  (resolve, reject) => {
    const handler = (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    };
    consolge.log(q);
    conn.query(q, handler);
  }
);
