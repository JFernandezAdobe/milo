import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../helpers/waitfor.js';

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Decorating', () => {
  before(async () => {
    await import('../../libs/scripts/scripts.js');
  });

  it('Decorates auto blocks', async () => {
    const autoBlock = document.querySelector('a[class]');
    expect(autoBlock.className).to.equal('adobetv link-block');
  });

  it('Decorates modal link', async () => {
    const modalLink = document.querySelector('a[data-modal-path]');
    expect(modalLink.dataset.modalPath).to.equal('/fragments/mock');
  });

  it('martech test', async () => {
    const el = await waitForElement(
      'script[src$="/libs/deps/martech.main.standard.min.js"]',
      { rootEl: document.head },
    );
    expect(el).to.exist;
    expect(window.alloy_all).to.exist;
  });

  it('Loads lana.js upon calling lana.log the first time', async () => {
    expect(window.lana.log).to.exist;

    sinon.spy(console, 'log');

    await window.lana.log('test', { clientId: 'myclient', sampleRate: 0 });
    expect(window.lana.options).to.exist;
    expect(console.log.args[0][0]).to.equal('LANA Msg: ');
    expect(console.log.args[0][1]).to.equal('test');
    console.log.restore();

    sinon.spy(console, 'log');
    await window.lana.log('test2', { clientId: 'myclient', sampleRate: 0 });
    expect(console.log.args[0][0]).to.equal('LANA Msg: ');
    expect(console.log.args[0][1]).to.equal('test2');
    console.log.restore();
  });
});
