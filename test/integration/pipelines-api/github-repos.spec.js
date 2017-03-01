const supertest = require('supertest');
const expect = require('chai').expect;
const qs = require('querystring');

describe('Pipelines API /api/v1/ci/github/repos', function () {
  const token = process.env.N3_KEY;
  const secret = process.env.N3_SECRET;
  const endpoint = 'https://cloud.acquia.com';
  const route = '/api/v1/ci/github/repos';
  this.timeout(10000);

  it('should return an array of repository objects', () => {
    const params = '?' + qs.stringify({
      per_page: 100,
      page: 1,
      applications: 'fbcd8f1f-4620-4bd6-9b60-f8d9d0f74fd0',
    });
    return supertest(process.env.PIPELINES_API_URI)
      .get(route + params)
      .set('X-ACQUIA-PIPELINES-N3-ENDPOINT', endpoint)
      .set('X-ACQUIA-PIPELINES-N3-KEY', token)
      .set('X-ACQUIA-PIPELINES-N3-SECRET', secret)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body).to.be.a('Array');
        expect(res.body[0]).to.be.a('Object');
        expect(res.body[0].full_name).to.exist;
        expect(res.body[0].url).to.exist;
        expect(res.body[0].description).to.exist;
      });
  });

  it('should return 403 when site doesn\'t have pipelines enabled', () => {
    const params = '?' + qs.stringify({
      per_page: 100,
      page: 1,
      applications: '410025b5-326d-7a84-b1bf-40ae95fb45f5',
    });
    return supertest(process.env.PIPELINES_API_URI)
      .get(route + params)
      .set('X-ACQUIA-PIPELINES-N3-ENDPOINT', endpoint)
      .set('X-ACQUIA-PIPELINES-N3-KEY', token)
      .set('X-ACQUIA-PIPELINES-N3-SECRET', secret)
      .expect(403)
      .then((res) => {
        expect(res.text).to.contain('Error authorizing request: site doesn\'t have pipelines enabled');
      });
  });

  it('should return 403 when application ID dont exists', () => {
    const params = '?' + qs.stringify({
      per_page: 100,
      page: 1,
      applications: 'e8ba21f2-529a-420c-9bcc-0000',
    });
    return supertest(process.env.PIPELINES_API_URI)
      .get(route + params)
      .set('X-ACQUIA-PIPELINES-N3-ENDPOINT', endpoint)
      .set('X-ACQUIA-PIPELINES-N3-KEY', token)
      .set('X-ACQUIA-PIPELINES-N3-SECRET', secret)
      .expect(403)
      .then((res) => {
        expect(res.text).to
          .contain('Error authorizing request: Expected([200, 201, 202, 203, 204, 205, 206, 302]) <=> Actual(400 Bad Request)');
      });
  });

  it('should return 403 when headers are missing from request ', () => {
    const params = '?' + qs.stringify({
      per_page: 100,
      page: 1,
      applications: 'fbcd8f1f-4620-4bd6-9b60-f8d9d0f74fd0',
    });
    return supertest(process.env.PIPELINES_API_URI)
      .get(route + params)
      .expect(403)
      .then((res) => {
        expect(res.text).to.contain('Missing mandatory parameters: n3_endpoint');
      });
  });
});
