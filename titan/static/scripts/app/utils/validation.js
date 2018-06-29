
const requiredScheduleFields = {
  execution: [
    'ScheduledExecutionName',
    'ScheduledExecutionNextScheduled',
    'ScheduledExecutionClientName',
    'ScheduledExecutionDataSourceName',
    'ScheduledExecutionDataSetName',
    'ScheduledExecutionNextLoadDate',
    'ScheduledExecutionUser'
  ]
};

function isValid(value) {
  return !!value
    && typeof value.trim === 'function'
    && !!value.trim().length;
}

export function validateScheduleData(data, acquireOptionConfig, extractOptionConfig) {


  // Validate execution
  for (let field of requiredScheduleFields.execution) {
    if (!isValid(data.execution[field])) {
      return false;
    }
  }

  const requiredAcquireOptions = acquireOptionConfig
    ? acquireOptionConfig
      .filter(option => option.AcquireProgramOptionRequired)
      .map(option => option.AcquireProgramOptionName)
    : [];

  // Check acquires, if applicable
  for (let acquire of data.acquires) {

    // Check name
    if (!isValid(acquire.ScheduledAcquireName)) {
      return false;
    }

    // Check required options
    for (let optionName of requiredAcquireOptions) {
      const option = acquire.Options
        .find(option => option.ScheduledAcquireOptionName === optionName);
      if (!option || !isValid(option.ScheduledAcquireOptionValue)) {
        return false;
      }
    }
  }


  // TODO
  // - Check extract, if applicable

  return true;
}

export function validateAdhocData(data) {

  // TODO
  // - Check execution
  // - Check acquires, if applicable
  // - Check extract, if applicable


}
