import type { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/entries">Entries</Link>
          </li>
          <li>
            <Link to="/categories">Categories</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <main>{children}</main>
    </div>
  );
};
