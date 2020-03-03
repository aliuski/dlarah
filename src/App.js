import React, { Component } from 'react';
import { Row, Col, Button, Card, Badge, Accordion } from 'react-bootstrap';
import { WindStatus } from './WindStatus';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import moment from 'moment'

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props)
    const { cookies } = props;
    this.state = {
      observation_list: [
        { source: 'Em%C3%A4salo', caption: 'Emäsalo', show: true },
        { source: 'It%C3%A4toukki', caption: 'Itätoukki', show: true },
        { source: 'Villinginluoto', caption: 'Villinginluoto', show: true },
        { source: 'Hel.Majakka', caption: 'Hel.Majakka', show: true },
        { source: 'Harmaja', caption: 'Harmaja', show: true },
        { source: 'Laru', caption: 'Laru', show: true },
        { source: 'eira', caption: 'Eira', show: true },
        { source: 'B%C3%A5gask%C3%A4r', caption: 'Bågaskär', show: true },
        { source: 'Jussar%C3%B6', caption: 'Jussarö', show: true },
        { source: 'Tulliniemi', caption: 'Tulliniemi', show: true },
        { source: 'Russar%C3%B6', caption: 'Russarö', show: true },
        { source: 'V%C3%A4n%C3%B6', caption: 'Vänö', show: true },
        { source: 'Ut%C3%B6', caption: 'Utö', show: true },
        { source: 'Tahkoluoto', caption: 'Tahkoluoto', show: true },
        { source: 'Tankar', caption: 'Tankar', show: true },
        { source: 'Ulkokalla', caption: 'Ulkokalla', show: true },
        { source: 'Marjaniemi', caption: 'Marjaniemi', show: true },
        { source: 'Vihre%C3%A4saari', caption: 'Vihreäsaari', show: true }],
      buttonstate: [],
      editState: false,
      Harmaja_ms: 0,
      Harmaja_c: 0,
      Laru_ms: 0,
      Laru_c: 0,
      Eira_ms: 0,
      Eira_c: 0,
      Itatoukki_ms: 0,
      Itatoukki_c: 0,
      Tulliniemi_ms: 0,
      Tulliniemi_c: 0,
      Tahkoluoto_ms: 0,
      Tahkoluoto_c: 0,
      Yyteri_ms: 0,
      Yyteri_c: 0,
    }
    let childlist = []
    for (var i = 0; i < this.state.observation_list.length; i++) {
      childlist.push(React.createRef())
      this.state.buttonstate.push(true)
    }
    this.child = childlist

    var pikkuleipa = cookies.get('windstations')
    if (pikkuleipa != null) {
      for (i = 0; i < this.state.observation_list.length; i++) {
        if (pikkuleipa.charAt(i) === '0') {
          this.state.observation_list[i].show = false
          this.state.buttonstate[i] = false
        }
      }
    }
    this.loadAll = this.loadAll.bind(this)
    this.editStation = this.editStation.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.functionwindrates = this.functionwindrates.bind(this);
    this.timmerRefres = this.timmerRefres.bind(this);
  }

  componentDidMount() {
    setInterval(this.timmerRefres, 300000)
  }

  timmerRefres() {
    this.loadAll()
  }

  loadAll() {
    for (var i = 0; i < this.state.observation_list.length; i++) {
      if (this.child[i].current != null)
        this.child[i].current.getWind();
    }
  }

  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;

    var temp = this.state.buttonstate
    temp[parseInt(item)] = isChecked
    this.setState({ buttonstate: temp });
  }

  editStation() {
    const { cookies } = this.props;
    if (this.state.editState) {
      var ol = this.state.observation_list
      var bs = this.state.buttonstate
      if (-1 === bs.indexOf(true))
        return
      var out = ''
      for (var i = 0; i < this.state.observation_list.length; i++) {
        ol[i].show = bs[i]
        if (bs[i])
          out += '1'
        else
          out += '0'
      }
      cookies.set('windstations', out, { path: '/', expires: new Date(moment().add(1, 'M').format()) });
      window.location.reload();
    }
    this.setState({ editState: !this.state.editState })
  }

  functionwindrates(wind, c, place) {
    var arr = ['Harmaja', 'Laru', 'Eira', 'Itätoukki', 'Tulliniemi', 'Tahkoluoto', 'Yyteri']
    if (arr.indexOf(place) > -1) {
      if (place === 'Itätoukki')
        place = 'Itatoukki'
      var pms = place + '_ms'
      var pc = place + '_c'
      this.setState({ [pms]: wind, [pc]: c })
    }
  }

  getLaru() {
    if (this.state.Harmaja_ms >= 10 && this.state.Harmaja_c >= 186 && this.state.Harmaja_c <= 220 &&
      this.state.Laru_ms >= 8 && this.state.Laru_c >= 186 && this.state.Laru_c <= 220 &&
      this.state.Eira_ms >= 8 && this.state.Eira_c >= 196 && this.state.Eira_c <= 230)
      return "* * *"
    else if (this.state.Harmaja_ms >= 8 && this.state.Harmaja_c >= 185 && this.state.Harmaja_c <= 235 &&
      this.state.Laru_ms >= 7 && this.state.Laru_c >= 185 && this.state.Laru_c <= 235 &&
      this.state.Eira_ms >= 7 && this.state.Eira_c >= 195 && this.state.Eira_c <= 245)
      return "* *"
    else if (this.state.Harmaja_ms >= 7 && this.state.Harmaja_c >= 180 && this.state.Harmaja_c <= 240 &&
      this.state.Laru_ms >= 6 && this.state.Laru_c >= 180 && this.state.Laru_c <= 240 &&
      this.state.Eira_ms >= 6 && this.state.Eira_c >= 190 && this.state.Eira_c <= 250)
      return "*"
    return ""
  }
  getKallvik() {
    if (this.state.Itatoukki_ms >= 9 && this.state.Itatoukki_c >= 100 && this.state.Itatoukki_c <= 180)
      // 'apinalahti', 'self.wind_speed>=7 and self.wind_dir>=100 and self.wind_dir<=180'
      return "* *"
    else if (this.state.Itatoukki_ms >= 7 && this.state.Itatoukki_c >= 75 && this.state.Itatoukki_c <= 290)
      //'apinalahti', 'self.wind_speed>=5 and self.wind_dir>=75 and self.wind_dir<=290'
      return "*"
    return ""
  }
  getEira() {
    if (this.state.Harmaja_ms >= 9 && this.state.Harmaja_c >= 120 && this.state.Harmaja_c <= 180 &&
      this.state.Eira_ms >= 7 && this.state.Eira_c >= 130 && this.state.Eira_c <= 190)
      return "* *"
    else if (this.state.Harmaja_ms >= 7 && this.state.Harmaja_c >= 110 && this.state.Harmaja_c <= 200 &&
      this.state.Eira_ms >= 6 && this.state.Eira_c >= 120 && this.state.Eira_c <= 210)
      return "*"
    return ""
  }
  getTullari() {
    if (this.state.Tulliniemi_ms >= 12 && this.state.Tulliniemi_c >= 95 && this.state.Tulliniemi_c <= 170)
      return "* * *"
    else if (this.state.Tulliniemi_ms >= 10 && this.state.Tulliniemi_c >= 90 && this.state.Tulliniemi_c <= 180)
      return "* *"
    else if (this.state.Tulliniemi_ms >= 8 && this.state.Tulliniemi_c >= 78 && this.state.Tulliniemi_c <= 205)
      return "*"
    return ""
  }
  getSilveri() {
    if (this.state.Tulliniemi_ms >= 10 && this.state.Tulliniemi_c >= 280 && this.state.Tulliniemi_c <= 320)
      return "* *"
    else if (this.state.Tulliniemi_ms >= 8 && (this.state.Tulliniemi_c >= 260 || this.state.Tulliniemi_c <= 20))
      return "*"
    return ""
  }
  getVeda() {
    if (this.state.Tulliniemi_ms >= 12 && this.state.Tulliniemi_c >= 160 && this.state.Tulliniemi_c <= 230)
      return "* * *"
    else if (this.state.Tulliniemi_ms >= 10 && this.state.Tulliniemi_c >= 110 && this.state.Tulliniemi_c <= 260)
      return "* *"
    else if (this.state.Tulliniemi_ms >= 8 && this.state.Tulliniemi_c >= 110 && this.state.Tulliniemi_c <= 260)
      return "*"
    return ""
  }
  get4TT() {
    if (this.state.Tulliniemi_ms >= 10 && this.state.Tulliniemi_c >= 160 && this.state.Tulliniemi_c <= 240)
      return "* *"
    else if (this.state.Tulliniemi_ms >= 8 && this.state.Tulliniemi_c >= 160 && this.state.Tulliniemi_c <= 255)
      return "*"
    return ""
  }
  getSlaktis() {
    // one star condition
    if (this.state.Tulliniemi_ms >= 8 && this.state.Tulliniemi_c >= 235 && this.state.Tulliniemi_c <= 275)
      return "*"
    else
      return ""
  }
  getYyteri() {
    if (this.state.Tahkoluoto_ms >= 10 && this.state.Tahkoluoto_c >= 210 && this.state.Tahkoluoto_c <= 280 &&
      this.state.Yyteri_ms >= 8 && this.state.Yyteri_c >= 210 && this.state.Yyteri_c <= 280)
      return "* * *"
    else if (this.state.Tahkoluoto_ms >= 9 && this.state.Tahkoluoto_c >= 210 && this.state.Tahkoluoto_c <= 280 &&
      this.state.Yyteri_ms >= 6 && this.state.Yyteri_c >= 210 && this.state.Yyteri_c <= 280)
      return "* *"
    else if (this.state.Tahkoluoto_ms >= 8 && this.state.Tahkoluoto_c >= 170 && this.state.Tahkoluoto_c <= 315 &&
      this.state.Yyteri_ms >= 5 && this.state.Yyteri_c >= 170 && this.state.Yyteri_c <= 315)
      return "*"
    return ""
  }
  getPollari() {
    if (this.state.Tahkoluoto_ms >= 8 && this.state.Tahkoluoto_c >= 230 && this.state.Tahkoluoto_c <= 260)
      return "* * *"
    else if (this.state.Tahkoluoto_ms >= 9 && this.state.Tahkoluoto_c >= 225 && this.state.Tahkoluoto_c <= 270)
      return "* *"
    else if (this.state.Tahkoluoto_ms >= 8 && this.state.Tahkoluoto_c >= 215 && this.state.Tahkoluoto_c <= 280)
      return "*"
    return ""
  }


  render() {
    return (
      <div className="App" class="container-fluid">
        <header className="App-header">
          <Row>
            <Col lg={{ span: 6, offset: 1 }}>
              <Row>
                <Col>
                  <Accordion>
                    <Card>
                      <Card.Header style={{ padding: 5 }}>
                        <div className="d-none d-sm-block">
                          <Row>
                            <Col sm={2}><Accordion.Toggle as={Button} variant="link" eventKey="0" style={{ padding: 0 }}><Badge variant="primary">Valikko</Badge></Accordion.Toggle></Col>
                            <Col sm={2}><Badge variant="light">Aika</Badge></Col>
                            <Col sm={2}><Badge variant="light">Keski</Badge></Col>
                            <Col sm={2}><Badge variant="light">Puuska</Badge></Col>
                            <Col sm={2}><Badge variant="light">Suunta</Badge></Col>
                            <Col sm={1}><Badge variant="light">&#186;C</Badge></Col>
                          </Row>
                        </div>
                        <div className="d-block d-sm-none">
                          <Row>
                            <Col xs={4}><Accordion.Toggle as={Button} variant="link" eventKey="0" style={{ padding: 0 }}><Badge variant="primary">Valikko</Badge></Accordion.Toggle></Col>
                            <Col xs={2}><Badge variant="light">Aika</Badge></Col>
                            <Col xs={3}><Badge variant="light">Tuuli</Badge></Col>
                            <Col xs={2}><Badge variant="light">Suunta</Badge></Col>
                          </Row>
                        </div>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <div>
                          {this.state.editState && this.state.observation_list.map((place, index) =>
                            <Row>
                              <Col xs={{ offset: 1 }}>
                                <input name={index} type="checkbox" checked={this.state.buttonstate[index]} onChange={this.handleChange} /> <Badge variant="light">{place.caption}</Badge>
                              </Col>
                            </Row>
                          )}
                          {!this.state.editState ?
                            <Row>
                              <Col xs={2}>
                                <Button bsStyle="primary" size="sm" onClick={this.loadAll}>Päivitä</Button>
                              </Col>
                              <Col>
                                <Button bsStyle="primary" size="sm" onClick={this.editStation}>Valitse mittausasemat</Button>
                              </Col>
                            </Row>
                            :
                            <Row>
                              <Col xs={{ offset: 1 }}>
                                <Button bsStyle="primary" size="sm" onClick={this.editStation}>Talleta</Button>
                              </Col>
                            </Row>
                          }
                        </div>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </Col>
              </Row>
            </Col>
          </Row>
          {this.state.observation_list.filter(item => item.show === true).map((place, index) =>
            <Row>
              <Col lg={{ span: 6, offset: 1 }}>
                <WindStatus ref={this.child[index]} source={place.source} caption={place.caption} functionwindrates={this.functionwindrates} />
              </Col>
            </Row>
          )}
          <Row>
            <Col lg={{ span: 6, offset: 1 }}>
              <Card>
                <Card.Header style={{ padding: 5 }}><Badge variant="light">Spotit</Badge></Card.Header>
                <Card.Body style={{ padding: 0 }}>
                  <Row>
                    {(this.state.buttonstate[4] && this.state.buttonstate[5] && this.state.buttonstate[6]) &&
                      <Col>
                        <Badge variant={this.getLaru() === '' ? "light" : "success"}>Laru {this.getLaru()}</Badge>
                      </Col>
                    }
                    {this.state.buttonstate[1] &&
                      <Col>
                        <Badge variant={this.getKallvik() === '' ? "light" : "success"}>Kallvik {this.getKallvik()}</Badge>
                      </Col>
                    }
                    {(this.state.buttonstate[4] && this.state.buttonstate[6]) &&
                      <Col>
                        <Badge variant={this.getEira() === '' ? "light" : "success"}>Eira {this.getEira()}</Badge>
                      </Col>
                    }
                    {!(this.state.buttonstate[4] && this.state.buttonstate[5] && this.state.buttonstate[6]) &&
                      <Col></Col>
                    }
                    {!this.state.buttonstate[1] &&
                      <Col></Col>
                    }
                    {!(this.state.buttonstate[4] && this.state.buttonstate[6]) &&
                      <Col></Col>
                    }
                  </Row>
                  {this.state.buttonstate[9] &&
                    <Row>
                      <Col>
                        <Badge variant={this.getTullari() === '' ? "light" : "success"}>Tullari {this.getTullari()}</Badge>
                      </Col>
                      <Col>
                        <Badge variant={this.getSilveri() === '' ? "light" : "success"}>Silveri {this.getSilveri()}</Badge>
                      </Col>
                      <Col>
                        <Badge variant={this.getVeda() === '' ? "light" : "success"}>Veda {this.getVeda()}</Badge>
                      </Col>
                    </Row>
                  }
                  {this.state.buttonstate[9] &&
                    <Row>
                      <Col>
                        <Badge variant={this.get4TT() === '' ? "light" : "success"}>4TT {this.get4TT()}</Badge>
                      </Col>
                      <Col>
                        <Badge variant={this.getSlaktis() === '' ? "light" : "success"}>Slaktis {this.getSlaktis()}</Badge>
                      </Col>
                      <Col>
                      </Col>
                    </Row>
                  }
                  {this.state.buttonstate[13] &&
                    <Row>
                      <Col>
                        <Badge variant={this.getYyteri() === '' ? "light" : "success"}>Yyteri {this.getYyteri()}</Badge>
                      </Col>
                      <Col>
                        <Badge variant={this.getPollari() === '' ? "light" : "success"}>Pollari {this.getPollari()}</Badge>
                      </Col>
                      <Col>
                      </Col>
                    </Row>
                  }
                </Card.Body>
              </Card>

            </Col>
          </Row>

        </header>
      </div>
    )
  }
}
export default withCookies(App);
