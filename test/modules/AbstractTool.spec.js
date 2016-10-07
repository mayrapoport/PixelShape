import test from 'blue-tape'
import sinon from 'sinon';
import AbstractTool from 'modules/basetool/AbstractTool';
import RenderingContext2d from '../mocks/RenderingContext2d.mock';

let tool, context;

const before = () => {
  tool = new AbstractTool();
  context = new RenderingContext2d();
};

test('AbstractTool =>', (expect) => {
  expect.test('::_assignBufferContext, ::_assignRenderingContext', (expect) => {
    before();

    tool.useStateOn = sinon.spy();
    tool._assignRenderingContext(context);
    expect.ok(tool._ctx, 'Should assign new rendering context');

    tool._assignBufferContext(context);
    expect.ok(tool._buffer, 'Should assign new buffer context');
    expect.ok(context.clearRect.called, 'Should clear the buffer context surface when assigned');
    expect.ok(tool.useStateOn.called, 'Should apply state on buffer context');
    expect.end();
  });

  expect.test('::applyState', (expect) => {
    before();

    const newState = {
      ghostData: {
        color: '#ababab',
        alpha: 1
      }
    };

    tool.applyState(newState);
    expect.deepEqual(tool.state.ghostData, newState.ghostData, 'Should set new props on the tools state');
    expect.end();
  });

  expect.test('::useStateOn', (expect) => {
    before();

    const state = {
      size: tool.state.size,
      color: tool.state.color,
      alpha: tool.state.alpha,
      compositeOperation: tool.state.compositeOperation
    };

    tool.useStateOn(context);

    const {
      lineWidth: size,
      fillStyle: color,
      globalAlpha: alpha,
      globalCompositeOperation: compositeOperation
    } = context;

    expect.deepEqual({ size, color, alpha, compositeOperation }, state, 'Should set new state on context');
    expect.end();
  });

  expect.test('::useGhostStateOn', (expect) => {
    before();

    const state = {
      alpha: tool.state.ghostData.alpha,
      color: tool.state.ghostData.color
    };

    tool.useGhostStateOn(context);

    const {
      globalAlpha: alpha,
      fillStyle: color
    } = context;

    expect.deepEqual({ alpha, color }, state, 'Should set new ghost state on context');
    expect.end();
  });

  expect.test('::getPixeledCoords', (expect) => {
    before();

    let coords;

    tool.applyState({ size: 20, gridCellSize: 10 });

    expect.false(tool.getPixeledCoords(), 'Should return false on empty args');

    coords = tool.getPixeledCoords(311, 207);

    expect.deepEqual(coords, { x: 300, y: 190 }, 'Should truncate input coords to grid cell size')
    expect.end();
  });

  expect.test('::drawPixelCell', (expect) => {
    before();

    tool.drawPixelCell(context, 100, 100);

    expect.ok(context.fillRect.called, 'Should draw pixel cell with provided coordinates');
    expect.end();
  });

  expect.test('::clearPixelCell', (expect) => {
    before();

    tool.clearPixelCell(context, 100, 100);

    expect.ok(context.clearRect.called, 'Should clear pixel cell with provided coordinates');
    expect.end();
  })

  expect.end();
});
