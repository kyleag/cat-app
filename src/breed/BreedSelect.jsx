import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Form } from 'react-bootstrap';
import Breed from '../api/breed'
import { setImageFilter, fetchImages, clearImages, showError } from '../actions';
import { STANDARD_ERROR, LOAD_LIST_ERROR } from '../messages'

/**
 * Component for the breed selection
 */
class BreedSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      api: new Breed(), // class to connect to the api
      breeds: [],
      value: this.props.selectedBreed // default to state
    }
  }

  /**
   * Retrieves necessary data after the component has been mounted
   */
  componentDidMount() {
    // retrieve list of available breeds for filtering
    this.getBreeds()
      .then(breeds => {
        this.setState({
          breeds
        })
      })
      .catch(error => {
        this.props.showError({
          message: STANDARD_ERROR,
          details: error.message
        })
      })
  }
  handleChange = (event) => {

    // make sure the current state of the component is updated
    const breed = event.target.value
    this.setState({
      value: breed
    })

    // since filter has been changed, the current list needs to be cleared first
    this.props.clearImages()

    // only fetch images if breed filter is provided
    if (breed) {
      // dispatch fetching of images with the provided filter params
      this.props.fetchImages({
        breed_id: breed,
        page: 0, // every time breed changes, start at the first page
        limit: 10, // @TODO - handle pagination better?
        order: 'Asc'
      })
      .catch(error => {
        this.props.showError({
          message: LOAD_LIST_ERROR,
          details: error.message
        })
      })
    }
  }

  /**
   * A select box of available breeds for filter
   */
  render() {
    return (
      <React.Fragment>
        <Form.Label>{this.props.label}</Form.Label>
        <Form.Control
          value={this.state.value}
          as="select"
          custom
          onChange={this.handleChange}
          disabled={this.props.loading}
        >
          <option value="">Select Breed</option>
          {
            this.state.breeds.map(breed => {
              return <option key={breed.id} value={breed.id}>{breed.name}</option>
            })
          }
        </Form.Control>
      </React.Fragment>
     );
  }

  /**
   * Retrieves all the available breeds
   */
  getBreeds() {
    return this.state.api.retrieve()
  }
}

// connect component to store
// @TODO - create a `selectors` file?
const mapSteteToProps = state => {
  return {
    selectedBreed: state.filter.breed_id,
    images: state.images,
    loading: state.loading
  }
}
const mapDispatchToProps = dispatch => {
  return {
    clearImages: () => dispatch(clearImages()),
    setImageFilter: (filter) => dispatch(setImageFilter(filter)),
    fetchImages: (filter) => dispatch(fetchImages(filter)),
    showError: (error) => dispatch(showError(error))
  }
}
export default connect(
  mapSteteToProps,
  mapDispatchToProps
)(BreedSelect);
