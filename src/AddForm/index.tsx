import React, { useReducer, useEffect } from 'react';
import { addEntry, getSpreadsheets } from '../api';

type FormFields = {
  name: string;
  amount: string;
  category: string;
};

export type AddFormState = {
  loading: boolean;
  initialized: boolean;
  spreadsheetId: string;
  form: FormFields;
};

const initialState = {
  loading: true,
  initialized: false,
  spreadsheetId: '',
  form: {
    name: '',
    amount: '',
    category: '',
  },
};

type AddFormAction =
  | { type: 'INIT_FORM' }
  | { type: 'INIT_FORM_SUCCESS'; spreadsheetId: string }
  | { type: 'USER_INPUT'; name: string; value: string }
  | { type: 'SUBMIT_FORM'; spreadsheetId: string; form: FormFields }
  | { type: 'SUBMIT_SUCCESS' };

function actionHandler(
  dispatch: (action: AddFormAction) => void,
): (action: AddFormAction) => void {
  return (action: AddFormAction) => {
    switch (action.type) {
      case 'INIT_FORM':
        dispatch(action);
        getSpreadsheets().then(result => {
          dispatch({ type: 'INIT_FORM_SUCCESS', spreadsheetId: result[0].id });
        });
        break;
      case 'USER_INPUT':
        dispatch(action);
        break;
      case 'SUBMIT_FORM': {
        dispatch(action);

        const { name, category, amount } = action.form;
        const date = new Date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;

        addEntry(action.spreadsheetId, {
          name,
          category,
          amount: parseFloat(amount),
          date: formattedDate,
        }).then(() => {
          dispatch({ type: 'SUBMIT_SUCCESS' });
        });
      }
      default:
        dispatch(action);
    }
  };
}

function reducer(state: AddFormState, action: AddFormAction): AddFormState {
  switch (action.type) {
    case 'INIT_FORM':
      return {
        loading: true,
        initialized: false,
        spreadsheetId: '',
        form: state.form,
      };
    case 'INIT_FORM_SUCCESS':
      return {
        loading: false,
        initialized: true,
        spreadsheetId: action.spreadsheetId,
        form: state.form,
      };
    case 'USER_INPUT':
      const { form } = state;
      const { name, value } = action;
      return {
        ...state,
        form: {
          ...form,
          [name]: value,
        },
      };
    case 'SUBMIT_FORM':
      return {
        ...state,
        loading: true,
        initialized: true,
      };
    case 'SUBMIT_SUCCESS':
      // TODO: new variable?
      return {
        ...state,
        loading: false,
        initialized: true,
      };
  }
}

const AddForm = () => {
  const [{ loading, initialized, spreadsheetId, form }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const actionDispatcher = actionHandler(dispatch);

  useEffect(() => {
    actionDispatcher({ type: 'INIT_FORM' });
  }, []);

  const inputHandler = event => {
    event.preventDefault();
    actionDispatcher({
      type: 'USER_INPUT',
      name: event.target.name,
      value: event.target.value,
    });
  };

  const submitHandler = event => {
    event.preventDefault();
    actionDispatcher({ type: 'SUBMIT_FORM', spreadsheetId, form });
  };

  if (loading && !initialized) {
    return <div>...loading</div>;
  }

  return (
    <form onSubmit={submitHandler}>
      <h1>Add Entry</h1>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={inputHandler}
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={inputHandler}
          required
        >
          <option value=""></option>
          <option value="Food">Food</option>
          <option value="Utilities">Utilities</option>
          <option value="Transportation">Transportation</option>
          <option value="House">House</option>
          <option value="Fun">Fun</option>
          <option value="Misc">Misc</option>
        </select>
      </div>
      <div>
        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          name="amount"
          value={form.amount}
          onChange={inputHandler}
        />
      </div>
      <div>
        <button type="submit" disabled={initialized && loading}>
          Save
        </button>
      </div>
    </form>
  );
};

export default AddForm;
