import FailError from '../errors/FailError';
import { connect } from 'mongoose';

const connection = async () => {
  try {
    await connect(`mongodb://mongo/social_network`);

    console.log('Successfully connected to the database');
  } catch (error) {
    console.log(error);
    throw new FailError('Could not connect to database');
  }
};

export default connection ;
