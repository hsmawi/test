const supertest = require('supertest');
const expect = require('chai').expect;
const qs = require('querystring');
const logAPICall = require('../log-helper').logAPICall;

describe('Pipelines API /api/v1/ci/encrypt', function () {
  const token = process.env.N3_KEY;
  const secret = process.env.N3_SECRET;
  const endpoint = 'https://cloud.acquia.com';
  const route = '/api/v1/ci/encrypt';
  this.timeout(10000);

  it('should return an encrypted value of data_item as string', () => {
    const params = '?' + qs.stringify({
      applications: 'fbcd8f1f-4620-4bd6-9b60-f8d9d0f74fd0',
      data_item: '12345-b5f2-4439-7716-1272dab0d6d0',
    });
    return supertest(process.env.PIPELINES_API_URI)
      .post(route + params)
      .set('X-ACQUIA-PIPELINES-N3-ENDPOINT', endpoint)
      .set('X-ACQUIA-PIPELINES-N3-KEY', token)
      .set('X-ACQUIA-PIPELINES-N3-SECRET', secret)
      .then((res) => {
        try {
          if (!res.ok && res.status !== 200) {
            throw res.text;
          } else {
            expect(res.header['content-type']).to.equal('application/json');
            expect(res.status).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body).to.be.not.null;
            expect(res.body).to.be.a('String');
          }
        } catch (e) {
          logAPICall(res, route, params);
          throw e;
        }
      });
  });

  it('should return 403 when site doesn\'t have pipelines enabled', () => {
    const params = '?' + qs.stringify({
      applications: '410025b5-326d-7a84-b1bf-40ae95fb45f5',
      data_item: '12345-b5f2-4439-7716-1272dab0d6d0',
    });
    return supertest(process.env.PIPELINES_API_URI)
      .post(route + params)
      .set('X-ACQUIA-PIPELINES-N3-ENDPOINT', endpoint)
      .set('X-ACQUIA-PIPELINES-N3-KEY', token)
      .set('X-ACQUIA-PIPELINES-N3-SECRET', secret)
      .then((res) => {
        try {
          if (!res.ok && res.status !== 403) {
            throw res.text;
          } else {
            expect(res.status).to.equal(403);
            expect(res.text).to.contain('Error authorizing request: site doesn\'t have pipelines enabled');
          }
        } catch (e) {
          logAPICall(res, route, params);
          throw e;
        }
      });
  });

  it('should return 403 when application ID dont exists', () => {
    const params = '?' + qs.stringify({
      applications: 'abcdef123-4620-4bd6-9b60-f8d9d0f74fd0',
      data_item: '12345-b5f2-4439-7716-1272dab0d6d0',
    });
    return supertest(process.env.PIPELINES_API_URI)
      .post(route + params)
      .set('X-ACQUIA-PIPELINES-N3-ENDPOINT', endpoint)
      .set('X-ACQUIA-PIPELINES-N3-KEY', token)
      .set('X-ACQUIA-PIPELINES-N3-SECRET', secret)
      .then((res) => {
        try {
          if (!res.ok && res.status !== 403) {
            throw res.text;
          } else {
            expect(res.status).to.equal(403);
            expect(res.text).to.contain('Error authorizing request: Expected([200, 201, 202, 203, 204, 205, 206, 302]) <=> Actual(400 Bad Request)');
          }
        } catch (e) {
          logAPICall(res, route, params);
          throw e;
        }
      });
  });

  it('should return 403 when headers are missing from request ', () => {
    const params = '?' + qs.stringify({
      applications: 'fbcd8f1f-4620-4bd6-9b60-f8d9d0f74fd0',
      data_item: '12345-b5f2-4439-7716-1272dab0d6d0',
    });
    return supertest(process.env.PIPELINES_API_URI)
      .post(route + params)
      .then((res) => {
        try {
          if (!res.ok && res.status !== 403) {
            throw res.text;
          } else {
            expect(res.status).to.equal(403);
            expect(res.text).to.contain('Missing mandatory parameters: n3_endpoint');
          }
        } catch (e) {
          logAPICall(res, route, params);
          throw e;
        }
      });
  });
});
