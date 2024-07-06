import { Response } from 'express';
import { StatusCodes as httpStatus } from 'http-status-codes';
import config from '../config';
import cryptoService from './encryptAndDecrypt';

type ResponseGeneratorParams = {
  res: Response;
  status: boolean;
  httpCode: number;
  message: string;
  result: any;
  statusCode: number;
  isEncrypted?: boolean;
};

const responseGenerator = ({
  res,
  status,
  httpCode,
  message,
  result,
  statusCode,
  isEncrypted = false
}: ResponseGeneratorParams): void => {
  res.status(httpCode);
  if (isEncrypted) {
    const response = JSON.stringify({ status, version: config.APP_VERSION, message, result });
    const encryptedData = cryptoService.encrypt(response);
    res.send(encryptedData);
  } else {
    res.send({
      status,
      status_code: statusCode,
      version: config.APP_VERSION,
      message,
      result
    });
  }
};

type ResponseParams = {
  res: Response;
  message?: string;
  result?: any;
  statusCode?: number;
  isEncrypted?: boolean;
};

const makeResponseForSuccess = ({
  res,
  message = 'Successfully processed.',
  result = {},
  statusCode = httpStatus.OK,
  isEncrypted = false
}: ResponseParams): void => {
  responseGenerator({
    res,
    status: true,
    httpCode: httpStatus.OK,
    message,
    result,
    statusCode,
    isEncrypted
  });
};

const makeResponseForFailed = ({
  res,
  message = 'Something went wrong!',
  result = {},
  statusCode = httpStatus.INTERNAL_SERVER_ERROR,
  isEncrypted = false
}: ResponseParams): void => {
  responseGenerator({
    res,
    status: false,
    httpCode: httpStatus.INTERNAL_SERVER_ERROR,
    message,
    result,
    statusCode,
    isEncrypted
  });
};

const makeResponseForBadRequest = ({
  res,
  message = 'Bad request!',
  result = {},
  statusCode = httpStatus.BAD_REQUEST,
  isEncrypted = false
}: ResponseParams): void => {
  responseGenerator({
    res,
    status: false,
    httpCode: httpStatus.BAD_REQUEST,
    message,
    result,
    statusCode,
    isEncrypted
  });
};

const makeResponseForUnauthenticated = ({
  res,
  message = 'Unauthorized!',
  result = {},
  statusCode = httpStatus.UNAUTHORIZED,
  isEncrypted = false
}: ResponseParams): void => {
  responseGenerator({
    res,
    status: false,
    httpCode: httpStatus.UNAUTHORIZED,
    message,
    result,
    statusCode,
    isEncrypted
  });
};

export {
  makeResponseForSuccess,
  makeResponseForFailed,
  makeResponseForBadRequest,
  makeResponseForUnauthenticated
};
