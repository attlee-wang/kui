/*
 * Copyright 2020 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react'
import Props, { Action } from '../model'

import {
  Card,
  CardActions,
  CardBody,
  CardHead,
  CardHeadMain,
  Dropdown,
  DropdownItem,
  KebabToggle
} from '@patternfly/react-core'

import '../../../../../web/scss/components/Card/Patternfly.scss'

interface State {
  isOpen: boolean
}

export default class PatternflyCard extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  private renderDropDownItems(actions: Action[]) {
    return actions.map(item => (
      <DropdownItem key="action" component="button" onClick={item.handler} data-mode={item.label}>
        {item.label}
      </DropdownItem>
    ))
  }

  private cardActions() {
    return (
      <CardActions>
        <Dropdown
          onSelect={() => this.setState({ isOpen: !this.state.isOpen })}
          toggle={
            <KebabToggle
              onToggle={isOpen => {
                this.setState({ isOpen })
              }}
            />
          }
          isOpen={this.state.isOpen}
          isPlain
          dropdownItems={this.renderDropDownItems(this.props.actions)}
          position={'right'}
        />
      </CardActions>
    )
  }

  public render() {
    return (
      <Card className={this.props.className}>
        {React.Children.count(this.props.children) > 0 && (
          <React.Fragment>
            <CardHead>
              <CardHeadMain>{this.props.header}</CardHeadMain>
              {this.props.actions && this.cardActions()}
            </CardHead>
            <CardBody>{this.props.children}</CardBody>
          </React.Fragment>
        )}
      </Card>
    )
  }
}