import React from 'react';
import ScheduleDays from './schedule/days.jsx';
import IntervalPicker from './interval-picker.jsx';
import DatePicker from 'react-datepicker';

// react-datepicker stylesheet
require('react-datepicker/dist/react-datepicker.css');

class ScheduleForm extends React.Component {

  constructor(props) {
    super(props);

    // TODO populate these from querying (componentDidMount)
    this.state = {
      id: this.props.id,

      name: '',
      nextScheduled: null,
      scheduleEnd: null,
      client: '',
      dataSource: '',
      dataSet: '',
      nextLoadDate: null,
      enabled: true,
      interval: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      days: {
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false
      }
    };

    this.onChange = this.onChange.bind(this);
    this.updateInterval = this.updateInterval.bind(this);
    this.updateNextScheduled = this.updateNextScheduled.bind(this);
    this.updateScheduleEnd = this.updateScheduleEnd.bind(this);
    this.updateNextLoadDate = this.updateNextLoadDate.bind(this);
    this.updateDay = this.updateDay.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    const target = event.target,
      name = target.name,
      value = target.value;

    this.setState({
      [name]: value
    });
  }

  updateInterval(hours, minutes, seconds) {
    this.setState({
      interval: {
        hours: hours,
        minutes: minutes,
        seconds: seconds
      }
    });
  }

  updateNextScheduled(value) {
    this.setState({
      nextScheduled: value
    });
  }

  updateScheduleEnd(value) {
    this.setState({
      scheduleEnd: value
    });
  }

  updateNextLoadDate(value) {
    this.setState({
      nextLoadDate: value
    });
  }

  updateDay(day, enabled) {
    const days = this.state.days;
    days[day] = enabled;
    this.setState({
      days: days
    });
  }

  onSubmit(event) {

    // TODO send insert/update to server
    console.log('Form submitted');

    event.preventDefault();
  }

  render() {

    // NOTE: Handles both insert and update

    // TODO form rows
    // - DONE name
    // - DONE next scheduled
    // - DONE schedule end
    // - DONE client name
    // - DONE data source name
    // - DONE data set name
    // - DONE next load date
    // - DONE enabled
    // - DONE interval duration (h/m/s)
    // - DONE daily enabled boxes
    // - acquire (key/name?)
    // - acquire option(s) (name/value)
    // - extract (key/name?)
    // - extract option(s) (name/value)
    // - status

    return (
      <form className="schedule-form" onSubmit={this.onSubmit}>

        <h5>{ this.state.id ? 'Update Schedule' : 'New Schedule' }</h5>

        <div className="row">
          <label>Name</label>
          <input type="text" name="name" value={this.state.name} onChange={this.onChange} />
        </div>
        <div className="row">
          <label>Next scheduled</label>
          <DatePicker selected={this.state.nextScheduled} dateFormat="DD/MM/YYYY" onChange={this.updateNextScheduled} />
        </div>
        <div className="row">
          <label>Schedule end</label>
          <DatePicker selected={this.state.scheduleEnd} dateFormat="DD/MM/YYYY" onChange={this.updateScheduleEnd} />
        </div>
        <div className="row">
          <label>Client</label>
          <input type="text" name="client" value={this.state.client} onChange={this.onChange} />
        </div>
        <div className="row">
          <label>Data Source</label>
          <input type="text" name="dataSource" value={this.state.dataSource} onChange={this.onChange} />
        </div>
        <div className="row">
          <label>Data set</label>
          <input type="text" name="dataSet" value={this.state.dataSet} onChange={this.onChange} />
        </div>
        <div className="row">
          <label>Next load date</label>
          <DatePicker selected={this.state.nextLoadDate} dateFormat="DD/MM/YYYY" onChange={this.updateNextLoadDate} />
        </div>
        <div className="row">
          <label>
            <input type="checkbox" name="enabled" checked={this.enabled} onChange={this.onChange} />
            <span className="label-body">Enabled</span>
          </label>
        </div>
        <div className="row">
          <label>Interval</label>
          <IntervalPicker hours={this.state.interval.hours} minutes={this.state.interval.minutes}
            seconds={this.state.interval.seconds} onUpdate={this.updateInterval} />
        </div>
        <div className="row">
          <ScheduleDays key="days" days={this.state.days} onChange={this.updateDay} />
        </div>

        <div className="row">
          <input type="submit" value={ this.state.id ? 'Update' : 'Create' } />
        </div>

      </form>
    );
  }

}

export default ScheduleForm;
