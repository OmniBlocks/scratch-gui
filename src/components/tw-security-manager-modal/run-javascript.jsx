import React from 'react';
import {FormattedMessage} from 'react-intl';

const RunJavaScript = () => (
    <div>
        <p>
            <FormattedMessage
                defaultMessage="The project wants to execute JavaScript code."
                // eslint-disable-next-line max-len
                description="Part of modal that appears when a project tries to execute JavaScript using an extension"
                id="tw.runJavaScript.title"
            />
        </p>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="This allows the extension to run arbitrary JavaScript code, which could potentially access your data or perform actions on your behalf. Only allow this if you trust the extension."
                // eslint-disable-next-line max-len
                description="Warning message in modal that appears when a project tries to execute JavaScript using an extension"
                id="tw.runJavaScript.warning"
            />
        </p>
        <p>
            <FormattedMessage
                // eslint-disable-next-line max-len
                defaultMessage="If allowed, the extension will be able to execute JavaScript code without further prompts."
                // eslint-disable-next-line max-len
                description="Part of modal that appears when a project tries to execute JavaScript using an extension"
                id="tw.runJavaScript.permission"
            />
        </p>
    </div>
);

export default RunJavaScript;