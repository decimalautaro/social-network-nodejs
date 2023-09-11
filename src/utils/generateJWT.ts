import jsonwebtoken from 'jsonwebtoken';

const generateJWT = (id: string) => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    jsonwebtoken.sign(
      payload,
      process.env.JWT_SECRET || '',
      {
        expiresIn: '8h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('Token could not be generated');
        } else {
          resolve(token);
        }
      },
    );
  });
};

export { generateJWT };
