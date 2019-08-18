import { h, Component } from 'preact';
import style from './minibutton.less';
import Label from '../label/label';

class LocalLabel extends Label {
    static defaultProps = {
        prefix: 'minibutton'
    };
}

export default class MiniButton extends Component {
    constructor(props) {
        super(props);
    }

    render(props, state) {
        const { isShowing, theme, onClick } = props;
        const {
            primaryColor,
            primaryTextColor,
            backgroundColor,
            textColor,
            textLightColor,
            textLinkColor,
        } = theme;

        return (
            <div
                ref={el => this.bannerRef = el}
                class={[style.miniButton, !isShowing ? style.hidden : ''].join(' ')}
                style={{
                    boxShadow: `0px 0px 5px ${primaryColor}`,
                    backgroundColor: backgroundColor,
                    color: textLightColor
                }}
            >
                <a class={style.btn} onClick={onClick}>
                    <LocalLabel>Cookies</LocalLabel>
                </a>
            </div>
        );
    }
}
