# JCDoc

JSDoc — a markup language used to annotate JavaScript source code files. JSDoc comments should generally be placed immediately before the code being documented. Each comment must start with a `/**` sequence in order to be recognized by the JSDoc parser. Comments beginning with `/*`, `/***`, or more than 3 stars will be ignored. This is a feature to allow you to suppress parsing of comment blocks.

**Example**:

```js
/**
 * Assign the project to an employee.
 * @param {Object} employee - The employee who is responsible for the project.
 * @param {string} employee.name - The name of the employee.
 * @param {string} employee.department - The employee's department.
 */
Project.prototype.assign = function(employee) {
    // ...
};
```

Learn more about JSDoc tags [here](https://jsdoc.app/).

## Ignore

To ignore the JSDoc comment and not render it to the documentation, use the `@ignore` tag.

**Example**:

```js
/**
 * Assign the project to an employee.
 * @ignore
 * @param {Object} employee - The employee who is responsible for the project.
 * @param {string} employee.name - The name of the employee.
 * @param {string} employee.department - The employee's department.
 */
Project.prototype.assign = function(employee) {
    // ...
};
```

## Custom tags

The CLI support following custom tags: 

### Exported

To add `Import` and `File` paths to the documentation use the `@exported` tag. 

**Example**:

```js
	/**
	 * The **central component of the SDK**. It is responsible for connecting to Barchart's
	 * servers, managing market data subscriptions, and maintaining market state. The
	 * SDK consumer should use one instance at a time.
	 *
	 * @public
	 * @exported
	 * @extends {ConnectionBase}
	 */
	class Connection extends ConnectionBase {
	  // ...
    }
```

**Output**: 
```markdown
## Connection :id=connection
>The **central component of the SDK**. It is responsible for connecting to Barchart's
servers, managing market data subscriptions, and maintaining market state. The
SDK consumer should use one instance at a time.

**Kind**: global class  
**Extends**: <code>ConnectionBase</code>  
**Access**: public  
**Import**: @barchart/marketdata-api-js/lib/connection/Connection  
**File**: /lib/connection/Connection.js  
```