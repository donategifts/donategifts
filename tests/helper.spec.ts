// eslint-disable-next-line import/no-extraneous-dependencies
import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { authMiddleware } from '../src/helper/authMiddleware';
import { decodeToken } from '../src/helper/jwt';

const invalidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZG9lLmNvbSIsInJvbGUiOiJkb25vciIsImlhdCI6MTYyNDUyMjM5NCwiZXhwIjoyMDk3ODg2Mzk0LCJpc3MiOiJiYXRjaCIsInN1YiI6ImxvZ2luIn0.H208djQzS1VOZ5QI4lV9cfppUgwq_ZfYO1P1O5geQnU';

const validToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkb25hdGVnaWZ0cyIsImlhdCI6MTYyNDUyNDU3NywiZXhwIjoxNjU2MDYwNTc5LCJhdWQiOiJhc2RmMTIzNHdlciIsInN1YiI6ImxvZ2luIiwiZW1haWwiOiJqb2huQGRvZS5jb20iLCJyb2xlIjoiZG9ub3IifQ.Ty72cK0sci367Id7uHdjXDWjNj25N85iqBfLZgzqhYk';

describe('Helper', () => {
  describe('jwt', () => {
    it('Should return empty object if the token is empty', () => {
      expect(decodeToken('', true, true)).toEqual({});
    });

    it('Should return empty object if the token is invalid', () => {
      expect(decodeToken(invalidToken, true, true)).toEqual({});
    });
  });

  describe.skip('authMiddleware', () => {
    let mockRequest: Request;
    let mockResponse: Response;
    const nextFunction = jest.fn();

    beforeEach(() => {
      mockRequest = {} as unknown as Request;
      mockResponse = {
        json: jest.fn(),
      } as unknown as Response;
    });

    it('should set a user object with a role as guest if no authorization is provided', () => {
      authMiddleware(mockRequest, mockResponse, nextFunction);

      expect(mockRequest.user).toHaveProperty('role');
    });

    it('should populate a full user object if authorization is provided', () => {
      mockRequest = {
        headers: {
          authorization: `JWT ${validToken}`,
        },
      } as Request;

      const expectedResponse = {
        email: 'john@doe.com',
        role: 'donor',
      };

      authMiddleware(mockRequest, mockResponse, nextFunction);

      expect(mockRequest.user).toMatchObject(expectedResponse);
    });
  });
});
