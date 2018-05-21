import importlib

import flask

from datalake import api, app, models
from datalake.api import decorators


@api.api_blueprint.route("/execute", methods=["POST"])
@decorators.to_json
def execute():
    data = flask.request.get_json(force=True).get("data", {"execution": {}, "acquires": [], "extract": {}})
    app.execute(data)
    return {}, 201, None


@api.api_blueprint.route("/acquire-programs/", methods=["GET"])
@decorators.to_json
def get_acquire_programs():
    acquire_programs = {}
    for row in models.get_acquire_programs():
        key = row["AcquireProgramKey"]
        acquire_program = acquire_programs.get(key)
        if acquire_program is None:
            acquire_programs[key] = {
                "AcquireProgramKey": key,
                "AcquireProgramPythonName": row["AcquireProgramPythonName"],
                "AcquireProgramFriendlyName": row["AcquireProgramFriendlyName"],
                "AcquireProgramDataSourceName": row["AcquireProgramDataSourceName"],
                "AcquireProgramEnabled": row["AcquireProgramEnabled"],
                "Options": []
            }
        option_name = row["AcquireProgramOptionName"]
        if option_name is not None:
            acquire_programs[key]["Options"].append({
                "AcquireProgramOptionName": option_name,
                "AcquireProgramOptionRequired": row["AcquireProgramOptionRequired"]}
            )
    return {"data": list(acquire_programs.values())}


@api.api_blueprint.route("/executions/<int:key>", methods=["GET"])
@decorators.to_json
def get_execution(key):
    return {"data": app.format_execution_details(models.get_execution(key))}


@api.api_blueprint.route("/executions/", methods=["GET"])
@decorators.to_json
def get_executions():
    params = {}
    for k in ("page_number", "page_size"):
        value = flask.request.args.get(k)
        if k is not None:
            params[k] = value
    return {"data": dict(row) for row in models.get_executions(**params)}


@api.api_blueprint.route("/extract-programs/", methods=["GET"])
@decorators.to_json
def get_extract_programs():
    response = {"data": []}
    for python_name, friendly_name in (("extract-azure-sql", "Azure SQL"), ):
        program = importlib.import_module("datalake.extract.%s" % python_name)
        response["data"].append({
            "ExtractProgramPythonName": python_name,
            "ExtractProgramFriendlyName": friendly_name,
            "Options": [
                {
                    "ExtractProgramOptionName": max(option.opts, key=len),
                    "ExtractProgramOptionRequired": option.required
                }
                for option in program.main.params
            ]
        })
    return response


@api.api_blueprint.route("/schedules/<int:key>", metods=["GET"])
@decorators.to_json
def get_scheduled_execution(key):
    return app.format_execution_details(models.get_scheduled_execution(key), scheduled=True)


@api.api_blueprint.route("/schedules/", methods=["GET"])
@decorators.to_json
def get_scheduled_executions():
    params = {}
    for k in ("page_number", "page_size"):
        value = flask.request.args.get(k)
        if k is not None:
            params[k] = value
    return {"data": dict(row) for row in models.get_scheduled_executions(**params)}


@api.api_blueprint.route("/schedules/", methods=["POST"])
@decorators.to_json
def insert_scheduled_execution():
    data = flask.request.get_json(force=True)
    execution = data.get("execution", {})
    acquires = data.get("acquires", [])
    extract = data.get("extract", {})
    with models.db.engine.begin() as transaction:
        result, _ = models.insert_scheduled_execution(transaction, execution, extract)
        scheduled_execution_key = result["ScheduledExecutionKey"]
        for acquire in acquires:
            acquire["ScheduledExecutionKey"] = scheduled_execution_key
            _, _ = models.insert_scheduled_acquire(transaction, acquire)
    return {}, 201, None


@api.api_blueprint.route("/executions/retry", methods=["POST"])
@decorators.to_json
def retry_executions():
    for key in flask.request.get_json(force=True)["keys"]:
        app.execute(app.format_execution_details(models.get_execution(key)))
    return {}, 201, None


@api.api_blueprint.route("/schedules/<int:key>", methods=["PUT"])
@decorators.to_json
def update_scheduled_execution(key):
    data = flask.request.get_json(force=True)
    params = {"ScheduledExecutionKey": key}
    execution = data.get("execution", {})
    execution.update(params)
    acquires = data.get("acquires", [])
    extract = data.get("extract", {})
    with models.db.engine.begin() as transaction:
        result, _ = models.update_scheduled_execution(transaction, execution, extract)
        _ = models.delete_scheduled_acquires(transaction, params)
        for acquire in acquires:
            acquire.update(params)
            _, _ = models.insert_scheduled_acquire(transaction, acquire)
    return {}, 201, None
