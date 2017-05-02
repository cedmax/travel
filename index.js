import React, {Component} from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import stuff from './default';
import minimist from 'minimist';
import piggyBank from 'piggy-bank';
import mkdirp from 'mkdirp';

mkdirp.sync('travels');

const trip = minimist(process.argv.slice(2))._.join('_');
if (!trip) {
  console.log("Name your trip, please");
  process.exit(1);
}

const store = piggyBank(`./travels/${trip}.json`);

function capitalise(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const checkboxHeight = 1;

const positions = [{
  top: 2,
  left: 1
}, {
  top: 2,
  right: 1
}, {
  bottom: 0,
  left: 1
}, {
  bottom: 0,
  right: 1
}]

const formProps = {
  parent: screen,
  label: `Travel List - ${capitalise(trip)}`,
  mouse: true,
   keys: true
}

const boxProps = {
  keys: true,
  width: "49%",
  height: "48%",
  border: {
    type: 'line'
  }
}

const getKeys = (obj) => Object.keys(obj);

// Rendering a simple centered box
class App extends Component {
  componentDidMount() {
    this.refs['ref-0-0'].focus();
  }

  render() {
    const sections = getKeys(stuff);
    const elements = sections.map((section, sectIdx) => {
      const items = stuff[section];
      return (
        <box
          key={section}
          label={capitalise(section)}
          {...Object.assign({}, positions[sectIdx], boxProps)}>
          {
            items.map((item, i) => (
              <checkbox
                ref={`ref-${sectIdx}-${i}`}
                mouse={true}
                height={checkboxHeight}
                keys={true}
                top={ checkboxHeight*i }
                key={ item }
                text={ capitalise(item) }
                onCheck={() => store.set(item, true, { overwrite: true })}
                onUncheck={() => store.set(item, false, { overwrite: true })}
                checked={ store.get(item) } />
            ))
          }
        </box>
      )
    });

    return (
      <form {...formProps}>
        {elements}
      </form>
    );
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'Travelist'
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Rendering the React app using our screen
const component = render(<App />, screen);
