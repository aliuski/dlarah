import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CustomizedDot } from './CustomizedDot';
import { Row, Col, Button, ButtonGroup, ToggleButton, ToggleButtonGroup, Card, Badge, Accordion } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment'

export class WindStatus extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selected_type: 1,
      lasttime: null,
      lastc: 0,
      lastwind: 0,
      lastmaxw: 0,
      lasttemp: 0,
      selected_date: new Date(),
      date_now: new Date(),
      load_on: true,
      graphic_scale: 0,
      mintemp: 0,
      maxtemp: 0
    }
    this.handleShowAllChange = this.handleShowAllChange.bind(this);
    this.loadBack = this.loadBack.bind(this);
    this.loadForward = this.loadForward.bind(this);
  }

  componentDidMount() {
    this.getWind()
  }

  handleShowAllChange(value, event) {
    this.setState({ selected_type: value });
  }

  loadBack() {
    this.loadWind(new Date(this.state.selected_date.getTime() - 86400000), false)
  }

  loadForward() {
    this.loadWind(new Date(this.state.selected_date.getTime() + 86400000), false)
  }

  getWind() {
    this.loadWind(new Date(), true)
  }

  convertDate(indate) {
    var d = new Date(indate.getFullYear(), 0, 1);
    return indate.getFullYear() + '-' + (parseInt((indate.getTime() - d.getTime()) / 86400000) + 1)
  }

  printDay() {
    return this.state.selected_date.getDate() + '.' + (this.state.selected_date.getMonth() + 1) + '.'
  }

  beforeDay() {
    return this.state.selected_date.getFullYear() >= this.state.date_now.getFullYear()
      && this.state.selected_date.getDate() >= this.state.date_now.getDate()
      && this.state.selected_date.getMonth() >= this.state.date_now.getMonth()
  }

  loadWind(selectdate, lastmeasurement) {
    this.setState({ load_on: true })
    axios.get("/wind_data/" + this.props.source + "_" + this.convertDate(selectdate) + ".txt")
      .then((response) => {
        var outputtable = []
        var temp = response.data.split("\n")
        var count = 0
        var last = temp.length / 15
        var graphic_scale = 0
        var mintemp = 0
        var maxtemp = 0
        for (var i = 0; i < temp.length - 1; i++) {
          var row = temp[i].split(",")
          var output = {}
          var c = parseInt(row[6])
          output.time = (new Date(row[0], row[1], row[2], row[3], row[4], 0, 0)).getTime()
          output.c = c
          output.wind = row[8]
          output.maxw = row[9]
          output.temp = row[10]
          if (count > last) {
            output.cp = c
            count = 0;
          }
          count++
          outputtable.push(output)
          if (row[9] > graphic_scale)
            graphic_scale = (parseInt(row[9] / 2) + 1) * 2
          if (row[10] < mintemp)
            mintemp = (parseInt(row[10] / 2) - 1) * 2
          if (row[10] > maxtemp)
            maxtemp = (parseInt(row[10] / 2) + 1) * 2
        }
        if (lastmeasurement) {
          var size = outputtable.length - 1
          this.setState({ graphic_scale: graphic_scale, mintemp: mintemp, maxtemp: maxtemp, load_on: false, data: outputtable, selected_date: selectdate, lasttime: outputtable[size].time, lastc: outputtable[size].c, lastwind: outputtable[size].wind, lastmaxw: outputtable[size].maxw, lasttemp: outputtable[size].temp })
        } else {
          this.setState({ graphic_scale: graphic_scale, mintemp: mintemp, maxtemp: maxtemp, load_on: false, data: outputtable, selected_date: selectdate })
        }
        this.props.functionwindrates(output.wind, output.c, this.props.caption)
      });
  }

  render() {
    return (
      <Accordion>
        <Card>
          <Card.Header style={{ padding: 5 }}>
            <div className="d-none d-sm-block">
              <Row>
                <Col sm={2}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0" disabled={this.state.lasttime == null} style={{ padding: 0 }}>
                    {this.props.caption}
                  </Accordion.Toggle>
                </Col>
                <Col sm={2}><Badge variant="light">{this.state.lasttime != null && moment(this.state.lasttime).format('HH:mm')}</Badge></Col>
                <Col sm={2}><Badge variant="light">{this.state.lastwind} m/s</Badge></Col>
                <Col sm={2}><Badge variant="light">{this.state.lastmaxw} m/s</Badge></Col>
                <Col sm={2}><Badge variant="light">{this.state.lastc} &#186;</Badge></Col>
                <Col sm={2}><Badge variant="light">{this.state.lasttemp} &#186;C</Badge></Col>
              </Row>
            </div>
            <div className="d-block d-sm-none">
              <Row>
                <Col xs={4}>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0" disabled={this.state.lasttime == null} style={{ padding: 0 }}>
                    {this.props.caption}
                  </Accordion.Toggle>
                </Col>
                <Col xs={2}><Badge variant="light">{this.state.lasttime != null && moment(this.state.lasttime).format('HH:mm')}</Badge></Col>
                <Col xs={3}><Badge variant="light">{this.state.lastwind} / {this.state.lastmaxw} m/s</Badge></Col>
                <Col xs={2}><Badge variant="light">{this.state.lastc} &#186;</Badge></Col>
              </Row>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body style={{ padding: 5 }}>
              <Row>
                <Col xs lg={{ span: 6, offset: 2 }}>
                  <ButtonGroup toggle>
                    <ToggleButtonGroup type="radio" name="options" defaultValue={true} value={this.state.selected_type} onChange={this.handleShowAllChange}>
                      <ToggleButton variant="outline-primary" size="sm" value={1} disabled={this.state.load_on}>Tuuli</ToggleButton>
                      <ToggleButton variant="outline-primary" size="sm" value={2} disabled={this.state.load_on}>Kulma</ToggleButton>
                      <ToggleButton variant="outline-primary" size="sm" value={3} disabled={this.state.load_on}>Lampötila</ToggleButton>
                    </ToggleButtonGroup>
                  </ButtonGroup>
                </Col><Col>
                  <ButtonGroup>
                    <Button variant="outline-dark" size="sm" disabled={this.state.load_on} onClick={this.loadBack} >&lt;</Button>
                    <Badge variant="light">{this.printDay()}</Badge>
                    <Button variant="outline-dark" size="sm" disabled={this.beforeDay() || this.state.load_on} onClick={this.loadForward}>&gt;</Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ResponsiveContainer width='100%' aspect={4.0 / 1.8}>
                    <LineChart margin={{ top: 5, right: 0, left: 0, bottom: 0 }} data={this.state.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis tick={{ fontSize: 14 }} dataKey="time" domain={['auto', 'auto']} tickFormatter={(tick) => moment(tick).format('HH:mm')} />
                      {this.linePens()}
                    </LineChart>
                  </ResponsiveContainer>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }

  linePens = () => {
    if (this.state.selected_type === 2)
      return [<YAxis tick={{ fontSize: 14 }} width={30} type="number" domain={[0, 360]} />, <Line type="monotone" dataKey="c" stroke='blue' dot={false} />]
    else if (this.state.selected_type === 3)
      return [<YAxis tick={{ fontSize: 14 }} width={30} type="number" domain={[this.state.mintemp, this.state.maxtemp]} />,
      <Line type="monotone" dataKey="temp" stroke='blue' dot={false} />]
    else {
      return [<YAxis tick={{ fontSize: 14 }} width={30} type="number" domain={[0, this.state.graphic_scale]} />,
      <Line type="monotone" dataKey="wind" stroke='blue' dot={false} />,
      <Line type="monotone" dataKey="maxw" stroke='green' dot={<CustomizedDot />} />]
    }
  }
}
