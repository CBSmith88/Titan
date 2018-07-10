import React from 'react';
import Select from 'react-select';
import Label from '../label.jsx';
import TextField from '../form-field/text-field.jsx';
import { fetchExtracts } from '../../services/data';

class ExtractForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      availableDestinations: [],
      destination: props.destination,
      options: props.options
    };

    this.onDestinationChange = this.onDestinationChange.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
  }

  componentDidMount() {
    // Get extract destinations from data service
    fetchExtracts(result => {
      this.setState({
        availableDestinations: result.data
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.destination !== this.state.destination) {
      this.setState({
        destination: nextProps.destination
      });
    }
    if (nextProps.options !== this.state.options) {
      this.setState({
        options: nextProps.options
      });
    }
  }

  onDestinationChange(destination) {

    // Pass the destination and options to the parent

    const label = destination ? destination.label : '';

    // Get option config
    const optionConfig = this.getOptionsConfig();

    // Reset options
    const options = optionConfig.map(option => {
      return this.createBlankExtractOption(option.ExtractProgramOptionName);
    });

    this.props.onDestinationChange(destination ? destination.value : '', options, optionConfig);
  }

  onOptionChange(e) {
    const target = e.target;
    const options = this.state.options;

    let option = options.find(option => option.ScheduledExtractOptionName === target.name);

    // Option not found?  Add it
    if (!option) {
      option = this.createBlankExtractOption(target.name);
      options.push(option);
    }

    option.ScheduledExtractOptionValue = target.value;

    // NOTE: Pass options config to parent, just in case it's not there
    this.props.onOptionsChange(options, this.getOptionsConfig());
  }

  createBlankExtractOption(name) {
    return {
      ScheduledExtractOptionName: name,
      ScheduledExtractOptionValue: ''
    }
  }

  getOptionsConfig(destinations) {
    const availableDestinations = destinations || this.state.availableDestinations;  // Use state if not specified
    const dest = availableDestinations.find(d => d.ExtractProgramPythonName === this.state.destination);
    return dest ? dest.Options : [];
  }

  render() {

    // NOTE:  We are passed a list of current values for the extract options, and a list containing
    //        all fields and details on whether they are mandatory (along with an explanation). We
    //        need to cross-reference the two so that blank options are still displayed.

    let rows = [];

    const destinationOptions = this.state.availableDestinations.map(destination => {
      return {
        value: destination.ExtractProgramPythonName,
        label: destination.ExtractProgramFriendlyName,
        options: destination.Options
      };
    });

    // Find the correct object from destinationObjects
    const destinationValue = destinationOptions.find(o => o.value === this.state.destination);

    if (this.state.destination) {

      // Get a list of all available options
      const optionsConfig = this.getOptionsConfig();

      rows = optionsConfig.map((optionConfig, index) => {

        // Option name
        const name = optionConfig.ExtractProgramOptionName;

        // Look for the existing value
        const option = this.state.options
          .find(option => option.ScheduledExtractOptionName === name);

        // Option not found? Create a blank value
        const value = option ? option.ScheduledExtractOptionValue : '';

        return (
          <TextField
            key={index}
            label={name}
            name={name}
            value={value}
            required={optionConfig.ExtractProgramOptionRequired}
            onChange={this.onOptionChange}
            validate={this.props.validate}
            tooltip={optionConfig.ExtractProgramOptionHelp}
          />
        );

      });
    }

    return (
      <div className="extract-form">
        <div>
          <Label>Destination</Label>
          <Select
            value={destinationValue}
            options={destinationOptions}
            onChange={this.onDestinationChange}
            className="titan-react-select"
          />
        </div>
        {rows}
      </div>
    );
  }

}

export default ExtractForm;
