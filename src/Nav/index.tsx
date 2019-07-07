import React from 'react';
import cn from 'classnames';
import styles from './index.module.css';
import GoogleSignin, { AuthState } from '../GoogleSignin';

export enum Page {
  Add = 'ADD',
  Entries = 'ENTRIES',
}

export interface NavProps {
  page: Page;
  updatePage: (page: Page) => void;
  updateAuth: (auth: AuthState) => void;
}

const Nav = ({ page, updatePage, updateAuth }: NavProps) => {
  return (
    <nav className={styles.navbar}>
      <button
        onClick={() => updatePage(Page.Add)}
        className={cn({ [styles.clicked]: page === Page.Add })}
      >
        Add
      </button>
      <button
        onClick={() => updatePage(Page.Entries)}
        className={cn({ [styles.clicked]: page === Page.Entries })}
      >
        View Entries
      </button>
      <div className={styles.pushRight}></div>
      <GoogleSignin updateAuth={updateAuth}></GoogleSignin>
    </nav>
  );
};

export default Nav;
