import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStoreFactory = configureMockStore(middlewares);

/**
 * Renders a component wrapped in a Redux <Provider> backed by redux-mock-store
 * and a <MemoryRouter>, so pages/components that call useSelector, useDispatch,
 * <Link>, or useNavigate work the same way they do inside the real app.
 *
 * Returns the standard RTL render result plus the mock store instance, so
 * tests can inspect store.getActions() when needed.
 */
function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = mockStoreFactory(preloadedState),
    route = '/',
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export default renderWithProviders;
