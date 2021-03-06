import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'

import css from './MultiRowGridList.css'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginLeft: -20,
    marginRight: -20,
    paddingTop: 5,
    paddingBottom: 5,
    [theme.breakpoints.up('lg')]: {
      marginLeft: 0,
      marginRight: 0,
    },
  },
  gridList: {
    width: '100%'
    // flexWrap: 'nowrap',
    // // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    // transform: 'translateZ(0)',
  },
  tile: {
    border: 'solid 5px yellow'
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}))

const mapImagesToFilLGrid = (images) => {
  let imgCols = images.length
  return images.map((img, idx) => {
    let c = 1
    if (imgCols % 3 !== 0 && ((idx + 1) === images.length || idx === 0)) {
      c = 2
      imgCols += 1
    }
    return {
      img: img.img,
      title: img.title,
      cols: c
    }
  })
}

const MultiRowGridList = (props) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <GridList
        className={classes.gridList}
        cols={3}
        spacing={10}
        cellHeight={300}
      >
        {mapImagesToFilLGrid(props.images).map((tile) => (
          <GridListTile
            key={tile.img}
            cols={tile.cols}
            classes={classes.tile}
          >
            <div
              className={css.gridImageContainer}
              onClick={() => console.log('click')}
            >
              <img className={css.gridImage} src={tile.img} alt={tile.title}/>
            </div>
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}

export default MultiRowGridList
