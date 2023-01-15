import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { LoadingBar } from 'react-redux-loading-bar';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export default class ImageLoader extends PureComponent {

  static propTypes = {
    alt: PropTypes.string,
    src: PropTypes.string.isRequired,
    previewSrc: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    onClick: PropTypes.func,
    zoomButtonHidden: PropTypes.bool,
  }

  static defaultProps = {
    alt: '',
    width: null,
    height: null,
  };

  state = {
    loading: true,
    error: false,
    width: null,
    minScale: 0,
    visibility: 'hidden',
  }

  removers = [];

  img = null;
  transformState = null;
  centerView = null;
  zoomToElement = null;

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.removers.push(() => window.removeEventListener('resize', this.onResize));
  }

  componentWillUnmount () {
    this.removeEventListeners();
  }

  removeEventListeners () {
    this.removers.forEach(listeners => listeners());
    this.removers = [];
  }

  onClickImage = e => {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  onLoadImage = e => {
    this.img = e.currentTarget;

    this.setState({
      loading: false,
    });
    if (this.zoomToElement && (this.img.naturalWidth > window.innerWidth || this.img.naturalHeight > window.innerHeight)) {
      this.zoomToElement(e.currentTarget, undefined, 0);
    }
    if (this.centerView) {
      this.centerView(undefined, 0);
    }
    setTimeout(() => {
      if (this.state.minScale === 0) {
        const minScale = this.transformState.scale < 1.0 ? this.transformState.scale : 1.0;
        this.setState({
          minScale,
          visibility: 'visible',
        });
      }
    }, 0);
  }

  lastResized = null;

  onResize = () => {
    if (this.lastResized) {
      clearTimeout(this.lastResized);
    }
    this.lastResized = setTimeout(() => {
      this.setState({
        minScale: 0,
      }, () => {
        if (this.zoomToElement) {
          this.zoomToElement(this.img, undefined, 0);
          setTimeout(() => {
            const minScale = this.transformState.scale < 1.0 ? this.transformState.scale : 1.0;
            this.setState({ minScale });
          }, 0);
        }
      });
    }, 32);

  }

  render () {
    const { alt, src, onClick } = this.props;
    const { loading } = this.state;

    const className = classNames('image-loader', {
      'image-loader--loading': loading,
    });

    return (
      <div className={className} onClick={onClick}>
        {loading && (
          <>
            <div className='loading-bar__container'>
              <LoadingBar className='loading-bar' loading={1} />
            </div>
          </>
        )}
        <TransformWrapper
          minScale={this.state.minScale}
          initialScale={1}
          limitToBounds
          centerZoomedOut
          centerOnInit
        >
          {({ state, zoomIn, zoomOut, zoomToElement, centerView, ...transformProps }) => {
            this.transformState = state;
            this.centerView = centerView;
            this.zoomToElement = zoomToElement;
            return (
              <TransformComponent
                wrapperStyle={{
                  width: '100dvw',
                  height: '100dvh',
                  overflow: 'hidden',
                }}
                contentStyle={{
                  width: 'fit-content',
                  height: 'fit-content',
                  transformOrigin: 'left top',
                }}
              >
                <img src={src} alt={alt} onLoad={this.onLoadImage} style={{ visibility: this.state.visibility }} onClick={this.onClickImage} />
              </TransformComponent>
            );
          }}
        </TransformWrapper>
      </div>
    );
  }

}
